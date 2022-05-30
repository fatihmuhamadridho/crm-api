const express = require('express');
const router = express.Router();
const database = require("../database");

const today = new Date();
const month = today.toLocaleString("default", { month: "long" });
const YYDD = `${String(today.getFullYear()).slice(2, 4)}${String(today.getDate())}`

router.get('/', async(req, res) => {
    const customers = database.getDb().collection("customers")
    try {
        const result = await customers.find({}).toArray()
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({ message: error })
    }
})

router.get('/:id', async(req, res) => {
    const customer = database.getDb().collection("customers")
    try {
        const result = await customer.findOne({ _id: req.params.id })
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({ message: error })
    }
})

router.post('/', async(req, res) => {
    const customer = database.getDb().collection("customers")
    const { 
        customerType,
        customerPriority,
        isRecyclebin,
        adminName,
        nik,
        fullName,
        nickName,
        gender,
        birthDate,
        phone,
        email,
        job,
        // tags
        tags,
        // address
        address,
        // family
        family,
        // more
        more,
        // summary
        summary,
        // history
        history
    } = req.body

    const data = await customer.find({}).toArray();
    const dataFilter = data?.filter(customer => (customer._id)?.slice(0,4) === String(YYDD))
    const dataLength = data?.filter(customer => (customer._id)?.slice(0,4) === String(YYDD))?.length
    const dataLastId = dataFilter[dataLength - 1]?._id
    const id = dataLastId !== undefined ? Number(dataLastId.toString().slice(6,10)) + 1 : 1

    const strId = "" + id;
    const padId = "00000";
    const contactId = padId.substring(0, padId.length - strId.length) + strId;
    const fixCustomerId = `${YYDD}-${contactId}`

    const newCustomer = {
        _id: fixCustomerId,
        customer_id: fixCustomerId,
        customerType: Number(customerType) || 0,
        customerPriority: Number(customerPriority) || 0,
        isRecyclebin: isRecyclebin || false,
        createDate: `${String(today.getDate())} ${month} ${String(today.getFullYear())}`,
        modifiedDate: `${String(today.getDate())} ${month} ${String(today.getFullYear())}`,
        adminName: adminName || "",
        nik: Number(nik) || 0,
        fullName: fullName || "",
        nickName: nickName || "",
        gender: gender || "",
        birthDate: birthDate || "",
        phone: phone || "",
        email: email || "",
        job: job || "",
        tags: tags || [],
        address: {
          province: address?.province || "",
          city: address?.city || "",
          district: address?.district || "",
          village: address?.village || "",
          detail: address?.detail || "",
          postalCode: address?.postalCode || "",
        },
        family: family?.map((family, index) => {
          return {
            customer_id: fixCustomerId,
            family_id: index + 1,
            family_status: family.family_status || "",
            family_fullName: family.family_fullName || "",
            family_gender: family.family_gender || "",
            family_birthDate: family.family_birthDate || "",
            family_description: family.family_description || ""
          }
        }) || [],
        more: {
          morePersonal: {
            pregnantAge: more?.morePersonal?.pregnantAge || "",
            religion: more?.morePersonal?.religion || "",
            hobby: more?.morePersonal?.hobby || "",
          },
          moreMedsos: {
            facebook: more?.moreMedsos?.facebook || "",
            twitter: more?.moreMedsos?.twitter || "",
            instagram: more?.moreMedsos?.instagram || "",
            website: more?.moreMedsos?.website || "",
          },
          moreOther: {
            dataSource: more?.moreOther?.dataSource || "",
            branch: more?.moreOther?.branch || "",
          },
          moreNote: more?.moreNote || [],
          moreMedcon: more?.moreMedcon?.map((medcon, index) => {
            return {
              customer_id: fixCustomerId,
              moreMedcon_id: index + 1,
              moreMedcon_phoneAlternative: medcon.moreMedcon_phoneAlternative || "",
              moreMedcon_whatsapp: medcon.moreMedcon_whatsapp || "",
              moreMedcon_emailAlternative: medcon.moreMedcon_emailAlternative || "",
            }
          }) || [],
          moreMCU: more?.moreMCU?.map((mcu, index) => {
            return {
              customer_id: fixCustomerId,
              moreMCU_id: index + 1,
              moreMCU_fullName: mcu.moreMCU_fullName || "",
              moreMCU_type: mcu.moreMCU_type || "",
              moreMCU_date: mcu.moreMCU_date || "",
              moreMCU_location: mcu.moreMCU_location || "",
              moreMCU_result: mcu.moreMCU_result || "",
              moreMCU_description: mcu.moreMCU_description || "",
            }
          }) || [],
          moreProcom: more?.moreProcom?.map((procom, index) => {
            return {
              customer_id: fixCustomerId,
              moreProcom_id: index + 1,
              moreProcom_productName: procom.moreProcom_productName || "",
              moreProcom_intensityUse: procom.moreProcom_intensityUse || "",
              moreProcom_transactionTotal: procom.moreProcom_transactionTotal || "",
              moreProcom_transactionDate: procom.moreProcom_transactionDate || "",
              moreProcom_transactionLocation: procom.moreProcom_transactionLocation || "",
            }
          }) || [],
        },
        summary: {
          sumEvent: summary?.sumEvent?.map((sumevent, index) => {
            return {
              customer_id: fixCustomerId,
              sumEvent_id: index + 1,
              sumEvent_name: sumevent.sumEvent_name || "",
              sumEvent_manager: sumevent.sumEvent_manager || "",
              sumEvent_date: sumevent.sumEvent_date || "",
              sumEvent_description: sumevent.sumEvent_description || ""
            }
          }) || [],
          sumOther: {
            sumOther_monthlyExpenses: summary?.sumOther?.sumOther_monthlyExpenses || "",
            sumOther_productFavorite: summary?.sumOther?.sumOther_productFavorite || "",
            sumOther_pointsAvailable: summary?.sumOther?.sumOther_pointsAvailable || "",
            sumOther_pointsExpired: summary?.sumOther?.sumOther_pointsExpired || "",
            sumOther_channelOrderFavorite: summary?.sumOther?.sumOther_channelOrderFavorite || "",
            sumOther_channelMainContact: summary?.sumOther?.sumOther_channelMainContact || "",
          },
        },
        history: history?.map((history, index) => {
          return {
            customer_id: fixCustomerId,
            history_id: index + 1,
            history_date: history.history_date || "",
            history_time: history.history_time || "",
            history_description: history.history_description || "",
          }
        }) || [],
    }

    try {
        const result = Array.isArray(req.body) ? await customer.insertMany(req.body.map((data,index) => {
          const fixCustomerIdMany = `${YYDD}-${padId.substring(0, padId.length - strId.length) + (Number(strId)+Number(""+index))}`
          return {
            _id: fixCustomerIdMany,
            customer_id: fixCustomerIdMany,
            customerType: Number(data?.customerType) || 0,
            customerPriority: Number(data?.customerPriority) || 0,
            isRecyclebin: data?.isRecyclebin || false,
            createDate: `${String(today.getDate())} ${month} ${String(today.getFullYear())}`,
            modifiedDate: `${String(today.getDate())} ${month} ${String(today.getFullYear())}`,
            adminName: data?.adminName || "",
            nik: Number(data?.nik) || 0,
            fullName: data?.fullName || "",
            nickName: data?.nickName || "",
            gender: data?.gender || "",
            birthDate: data?.birthDate || "",
            phone: data?.phone || "",
            email: data?.email || "",
            job: data?.job || "",
            tags: data?.tags || [],
            address: {
              province: data?.address?.province || "",
              city: data?.address?.city || "",
              district: data?.address?.district || "",
              village: data?.address?.village || "",
              detail: data?.address?.detail || "",
              postalCode: data?.address?.postalCode || "",
            },
            family: data?.family?.map((family, index) => {
              return {
                customer_id: fixCustomerIdMany,
                family_id: index + 1,
                family_status: family.family_status || "",
                family_fullName: family.family_fullName || "",
                family_gender: family.family_gender || "",
                family_birthDate: family.family_birthDate || "",
                family_description: family.family_description || ""
              }
            }) || [],
            more: {
              morePersonal: {
                pregnantAge: data?.more?.morePersonal?.pregnantAge || "",
                religion: data?.more?.morePersonal?.religion || "",
                hobby: data?.more?.morePersonal?.hobby || "",
              },
              moreMedsos: {
                facebook: data?.more?.moreMedsos?.facebook || "",
                twitter: data?.more?.moreMedsos?.twitter || "",
                instagram: data?.more?.moreMedsos?.instagram || "",
                website: data?.more?.moreMedsos?.website || "",
              },
              moreOther: {
                dataSource: data?.more?.moreOther?.dataSource || "",
                branch: data?.more?.moreOther?.branch || "",
              },
              moreNote: data?.more?.moreNote || [],
              moreMedcon: data?.more?.moreMedcon?.map((medcon, index) => {
                return {
                  customer_id: fixCustomerIdMany,
                  moreMedcon_id: index + 1,
                  moreMedcon_phoneAlternative: medcon.moreMedcon_phoneAlternative || "",
                  moreMedcon_whatsapp: medcon.moreMedcon_whatsapp || "",
                  moreMedcon_emailAlternative: medcon.moreMedcon_emailAlternative || "",
                }
              }) || [],
              moreMCU: data?.more?.moreMCU?.map((mcu, index) => {
                return {
                  customer_id: fixCustomerIdMany,
                  moreMCU_id: index + 1,
                  moreMCU_fullName: mcu.moreMCU_fullName || "",
                  moreMCU_type: mcu.moreMCU_type || "",
                  moreMCU_date: mcu.moreMCU_date || "",
                  moreMCU_location: mcu.moreMCU_location || "",
                  moreMCU_result: mcu.moreMCU_result || "",
                  moreMCU_description: mcu.moreMCU_description || "",
                }
              }) || [],
              moreProcom: data?.more?.moreProcom?.map((procom, index) => {
                return {
                  customer_id: fixCustomerIdMany,
                  moreProcom_id: index + 1,
                  moreProcom_productName: procom.moreProcom_productName || "",
                  moreProcom_intensityUse: procom.moreProcom_intensityUse || "",
                  moreProcom_transactionTotal: procom.moreProcom_transactionTotal || "",
                  moreProcom_transactionDate: procom.moreProcom_transactionDate || "",
                  moreProcom_transactionLocation: procom.moreProcom_transactionLocation || "",
                }
              }) || [],
            },
            summary: {
              sumEvent: data?.summary?.sumEvent?.map((sumevent, index) => {
                return {
                  customer_id: fixCustomerIdMany,
                  sumEvent_id: index + 1,
                  sumEvent_name: sumevent.sumEvent_name || "",
                  sumEvent_manager: sumevent.sumEvent_manager || "",
                  sumEvent_date: sumevent.sumEvent_date || "",
                  sumEvent_description: sumevent.sumEvent_description || ""
                }
              }) || [],
              sumOther: {
                sumOther_monthlyExpenses: data?.summary?.sumOther?.sumOther_monthlyExpenses || "",
                sumOther_productFavorite: data?.summary?.sumOther?.sumOther_productFavorite || "",
                sumOther_pointsAvailable: data?.summary?.sumOther?.sumOther_pointsAvailable || "",
                sumOther_pointsExpired: data?.summary?.sumOther?.sumOther_pointsExpired || "",
                sumOther_channelOrderFavorite: data?.summary?.sumOther?.sumOther_channelOrderFavorite || "",
                sumOther_channelMainContact: data?.summary?.sumOther?.sumOther_channelMainContact || "",
              },
            },
            history: data?.history?.map((history, index) => {
              return {
                customer_id: fixCustomerIdMany,
                history_id: index + 1,
                history_date: history.history_date || "",
                history_time: history.history_time || "",
                history_description: history.history_description || "",
              }
            }) || [],
          }
        })) : await customer.insertOne(newCustomer)
        res.status(200).json({ result: result, body: req.body })
    } catch (error) {
        res.status(400).json({ message: error })
    }
})

router.put('/:id', async(req, res) => {
    const customer = database.getDb().collection("customers")
    const {
        customerType,
        customerPriority,
        isRecyclebin,
        adminName,
        nik,
        fullName,
        nickName,
        gender,
        birthDate,
        phone,
        email,
        job,
        // tags
        tags,
        // address
        address,
        // family
        family,
        // more
        more,
        // summary
        summary,
        // history
        history
    } = req.body
    const newCustomer = {
        $set: {
            customerType: Number(customerType) || 0,
            customerPriority: Number(customerPriority) || 0,
            isRecyclebin: isRecyclebin || false,
            modifiedDate: `${String(today.getDate())} ${month} ${String(today.getFullYear())}`,
            adminName: adminName || "",
            nik: Number(nik) || 0,
            fullName: fullName || "",
            nickName: nickName || "",
            gender: gender || "",
            birthDate: birthDate || "",
            phone: phone || "",
            email: email || "",
            job: job || "",
            tags: tags || [],
            address: {
              province: address?.province || "",
              city: address?.city || "",
              district: address?.district || "",
              village: address?.village || "",
              detail: address?.detail || "",
              postalCode: address?.postalCode || "",
            },
            family: family?.map((family, index) => {
              return {
                family_id: index + 1,
                family_status: family.family_status || "",
                family_fullName: family.family_fullName || "",
                family_gender: family.family_gender || "",
                family_birthDate: family.family_birthDate || "",
                family_description: family.family_description || ""
              }
            }) || [],
            more: {
              morePersonal: {
                pregnantAge: more?.morePersonal?.pregnantAge || "",
                religion: more?.morePersonal?.religion || "",
                hobby: more?.morePersonal?.hobby || "",
              },
              moreMedsos: {
                facebook: more?.moreMedsos?.facebook || "",
                twitter: more?.moreMedsos?.twitter || "",
                instagram: more?.moreMedsos?.instagram || "",
                website: more?.moreMedsos?.website || "",
              },
              moreOther: {
                dataSource: more?.moreOther?.dataSource || "",
                branch: more?.moreOther?.branch || "",
              },
              moreNote: more?.moreNote || "",
              moreMedcon: more?.moreMedcon?.map((medcon, index) => {
                return {
                  moreMedcon_id: index + 1,
                  moreMedcon_phoneAlternative: medcon.moreMedcon_phoneAlternative || "",
                  moreMedcon_whatsapp: medcon.moreMedcon_whatsapp || "",
                  moreMedcon_emailAlternative: medcon.moreMedcon_emailAlternative || "",
                }
              }) || [],
              moreMCU: more?.moreMCU?.map((mcu, index) => {
                return {
                  moreMCU_id: index + 1,
                  moreMCU_fullName: mcu.moreMCU_fullName || "",
                  moreMCU_type: mcu.moreMCU_type || "",
                  moreMCU_date: mcu.moreMCU_date || "",
                  moreMCU_location: mcu.moreMCU_location || "",
                  moreMCU_result: mcu.moreMCU_result || "",
                  moreMCU_description: mcu.moreMCU_description || "",
                }
              }) || [],
              moreProcom: more?.moreProcom?.map((procom, index) => {
                return {
                  moreProcom_id: index + 1,
                  moreProcom_productName: procom.moreProcom_productName || "",
                  moreProcom_intensityUse: procom.moreProcom_intensityUse || "",
                  moreProcom_transactionTotal: procom.moreProcom_transactionTotal || "",
                  moreProcom_transactionDate: procom.moreProcom_transactionDate || "",
                  moreProcom_transactionLocation: procom.moreProcom_transactionLocation || "",
                }
              }) || [],
            },
            summary: {
              sumEvent: summary?.sumEvent?.map((sumevent, index) => {
                return {
                  sumEvent_id: index + 1,
                  sumEvent_name: sumevent.sumEvent_name || "",
                  sumEvent_manager: sumevent.sumEvent_manager || "",
                  sumEvent_date: sumevent.sumEvent_date || "",
                  sumEvent_description: sumevent.sumEvent_description || ""
                }
              }),
              sumOther: {
                sumOther_monthlyExpenses: summary?.sumOther?.sumOther_monthlyExpenses || "",
                sumOther_productFavorite: summary?.sumOther?.sumOther_productFavorite || "",
                sumOther_pointsAvailable: summary?.sumOther?.sumOther_pointsAvailable || "",
                sumOther_pointsExpired: summary?.sumOther?.sumOther_pointsExpired || "",
                sumOther_channelOrderFavorite: summary?.sumOther?.sumOther_channelOrderFavorite || "",
                sumOther_channelMainContact: summary?.sumOther?.sumOther_channelMainContact || "",
              },
            },
            history: history?.map((history, index) => {
              return {
                history_id: index + 1,
                history_date: history.history_date || "",
                history_time: history.history_time || "",
                history_description: history.history_description || "",
              }
            }) || [],
        },
    }
    try {
        const result = await customer.updateOne({ _id: req.params.id }, newCustomer)
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({ message: "error" })
    }
})

router.delete('/:id', async(req,res) => {
    const customer = database.getDb().collection("customers")
    try {
        const result = await customer.deleteOne({ _id: req.params.id })
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({ message: error })
    }
})

module.exports = router;